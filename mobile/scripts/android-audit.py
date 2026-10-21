#!/usr/bin/env python3
"""Inspect an Android bundle/APK without extracting native libraries to disk."""
import hashlib, json, struct, sys, zipfile
from pathlib import Path
artifact = Path(sys.argv[1]).resolve()
report = {'artifact': str(artifact), 'bytes': artifact.stat().st_size,
          'sha256': hashlib.sha256(artifact.read_bytes()).hexdigest(), 'native_libraries': []}
with zipfile.ZipFile(artifact) as archive:
    report['jar_signed'] = any(n.upper().startswith('META-INF/') and n.upper().endswith(('.RSA', '.DSA', '.EC')) for n in archive.namelist())
    for name in archive.namelist():
        if not name.endswith('.so'): continue
        data = archive.read(name)
        if data[:4] != b'\x7fELF': raise SystemExit(f'Not ELF: {name}')
        bits, endian = data[4], '<' if data[5] == 1 else '>'
        if bits == 2:
            phoff, = struct.unpack_from(endian+'Q', data, 32)
            phentsize, phnum = struct.unpack_from(endian+'HH', data, 54)
            header = endian+'IIQQQQQQ'
        elif bits == 1:
            phoff, = struct.unpack_from(endian+'I', data, 28)
            phentsize, phnum = struct.unpack_from(endian+'HH', data, 42)
            header = endian+'IIIIIIII'
        else: raise SystemExit(f'Unknown ELF class: {name}')
        alignments = []
        for i in range(phnum):
            values = struct.unpack_from(header, data, phoff+i*phentsize)
            if values[0] == 1: alignments.append(values[-1])
        report['native_libraries'].append({'path': name, 'elf_bits': 64 if bits == 2 else 32,
          'load_alignments': alignments, 'page_16kb_compatible': bool(alignments) and all(a >= 16384 for a in alignments)})
report['all_native_16kb_compatible'] = bool(report['native_libraries']) and all(x['page_16kb_compatible'] for x in report['native_libraries'])
print(json.dumps(report, indent=2))
if not report['all_native_16kb_compatible']: sys.exit(1)
