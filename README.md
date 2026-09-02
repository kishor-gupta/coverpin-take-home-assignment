# Order Infrastructure

A browser-resident service procurement intake: pick a catalog offering, walk a multi-section form, save incomplete drafts locally, and place an order only when the type schema is complete.

No backend, auth provider, payments, or operational workflow. State lives in `localStorage`. Users are hardcoded so access rules can be demonstrated.

## Run

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## Hardcoded users

Switch users in the header. This is not an authentication product.

| User | Role in the demo |
| --- | --- |
| Alice Chen (`alice`) | Default actor |
| Bob Okonkwo (`bob`) | Second actor — cannot see Alice’s drafts |

Rules enforced in `src/access/` on every read/write, not only in the UI:

- Drafts are visible, editable, and deletable only by their creator
- Submitted orders are visible to every user and are immutable

## Architecture

Types are declarations. The runtime never switches on an order type. Adding a type is a new folder plus one registry line.

```
src/
  registry/       type map + section-component map
  runtime/        wizard, generic summary, schema scoping
  persistence/    localStorage only — no permissions
  access/         intercepts list/get/save/delete/submit
  sections/       portable section modules (props only)
  order-types/    schema, defaults, section list, submit mapping
```

**Order type contract**

- Identity is an immutable key (`GENERIC_ORDER`, `CERTIFICATE_OF_GOOD_STANDING`, …)
- A type is an ordered list of common and bespoke sections
- One Zod schema per type; the runtime scopes errors to the current section
- Every type ends with `REVIEW_AND_PLACE`
- The review/summary component iterates `definition.sections` and asks each section for its own summary view

**Sections** receive `values`, `errors`, `handlers`, and `state`. They do not import the router, store, or registry.

Core sections (referenced by key): `TEXT_FIELD`, `TEXT_AND_FILE`, `DESCRIPTION`, `REVIEW_AND_PLACE`.

Bespoke sections used by Certificate of Good Standing: `MULTI_SELECT_AND_TEXT`, `DESCRIPTION_AND_FILE`.

## Seed types

| Key | What it shows |
| --- | --- |
| `GENERIC_ORDER` | Text + file, description, review |
| `CERTIFICATE_OF_GOOD_STANDING` | Text, multi-select + text, description + file, review |

Drafts persist even when invalid. **Place order** validates the entire schema at once.

## Add a type

1. Create `src/order-types/<name>/index.ts` with `key`, `label`, `category`, `sections`, `schema`, `defaults`, and `toSubmission`.
2. Reuse existing section keys. Register a new section module only if you need a new field composition.
3. Add one `registerOrderType(...)` call in [`src/registry/orderTypes.ts`](src/registry/orderTypes.ts).

Do not edit the wizard, summary, persistence, or access modules.

Appendix A (`CERTIFICATE_OF_INCUMBENCY`) is added in a later commit on `main` to show that path.

## Demo notes

File uploads are stored as metadata + a data URL in `localStorage` (1.5 MB cap). Saving a draft writes immediately and shows a timestamp.
