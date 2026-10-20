# Supply a reviewed digest at activation; no application dependencies are installed.
ARG NODE_IMAGE=node:24-alpine
FROM ${NODE_IMAGE} AS compile
WORKDIR /source
COPY scripts/school-scanner.ts ./scanner.ts
COPY lib/school/scanner-health.ts ./scanner-health.ts
RUN node --input-type=module -e 'import{readFileSync,writeFileSync}from "node:fs";import{stripTypeScriptTypes}from "node:module";for(const name of ["scanner-health","scanner"]){const s=readFileSync(name+".ts","utf8").replace("../lib/school/scanner-health","./scanner-health.mjs");writeFileSync(name+".mjs",stripTypeScriptTypes(s));}'
FROM ${NODE_IMAGE}
ENV NODE_ENV=production
WORKDIR /app
COPY --from=compile /source/*.mjs ./
COPY infra/school-scanner/entry.mjs infra/school-scanner/health.mjs ./
USER node
EXPOSE 3311
CMD ["node", "entry.mjs"]
