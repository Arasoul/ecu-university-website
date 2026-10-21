# ECU editorial workflow

The website uses a source-led data model rather than a large CMS. Each public record should retain:

- `id` and `contentType`
- `sourceUrls`
- `verification` and `verifiedOn`
- `editorialStatus` (`draft`, `review_required`, `approved`)
- `publishStatus` (`unpublished`, `published`, `archived`)
- `locale`
- `imageAuthorization` when media is referenced
- `updatedOn`

Editors update the JSON records under `data/imports/` through review, then run the repository validation checks before publishing. Records marked `review_required`, `unpublished`, or `do_not_publish_until_authorized` must not be rendered as public content. The current verified dataset remains English and includes no approved media rights.

Update history is preserved through Git commits. A future ECU editorial tool can write the same fields and open a review pull request without changing the public components.
