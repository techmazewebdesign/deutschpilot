import json, struct, subprocess, sys, tempfile, unittest, zipfile
from pathlib import Path

SCRIPT = Path(__file__).with_name('android-audit.py')

def elf(machine=183, alignment=16384):
    data = bytearray(120)
    data[:6] = b'\x7fELF\x02\x01'
    struct.pack_into('<H', data, 18, machine)
    struct.pack_into('<Q', data, 32, 64)
    struct.pack_into('<HH', data, 54, 56, 1)
    struct.pack_into('<IIQQQQQQ', data, 64, 1, 5, 0, 0, 0, 120, 120, alignment)
    return data

class AuditTests(unittest.TestCase):
    def audit(self, machine=183, alignment=16384):
        with tempfile.TemporaryDirectory(prefix='deutschpilot-android-audit-') as folder:
            bundle = Path(folder)/'synthetic.aab'
            with zipfile.ZipFile(bundle, 'w') as archive:
                archive.writestr('base/lib/arm64-v8a/libsynthetic.so', elf(machine, alignment))
            result = subprocess.run([sys.executable, str(SCRIPT), str(bundle)], capture_output=True, text=True)
            return result.returncode, json.loads(result.stdout)
    def test_valid_arm64_and_16k_load_segments_are_accepted(self):
        code, report = self.audit()
        self.assertEqual(code, 0)
        self.assertTrue(report['all_native_abi_valid'])
        self.assertTrue(report['all_native_16kb_compatible'])
    def test_x86_64_under_arm64_path_is_rejected(self):
        code, report = self.audit(machine=62)
        self.assertEqual(code, 1)
        self.assertFalse(report['all_native_abi_valid'])
        self.assertEqual(report['native_libraries'][0]['elf_machine'], 62)
    def test_4k_load_alignment_is_rejected(self):
        code, report = self.audit(alignment=4096)
        self.assertEqual(code, 1)
        self.assertFalse(report['all_native_16kb_compatible'])

if __name__ == '__main__': unittest.main()
