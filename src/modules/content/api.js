export function fetchEntries (type, { offset, limit, where } = {}) {
  return globalThis.$.query($ => {
    console.log("Q", { $, type })
    return $[type]
      .activeRevisions()
      .find(where)
      .skip(offset)
      .limit(limit)
      .meta({
        total: $[type]
          .activeRevisions()
          .find(where)
          .count()
      })
      .include(($, post) => $(
        post.tag,
        post.category
      ))
      .data()
  })
}

export function createEntry (type, payload) {
  return globalThis.$.query($ => $[type].createDocument(payload))
}

export function updateEntry (type, { document: { id }, record, revision: { id: from }}) {
  return globalThis.$.query($ => $[type].createRevision(id, record, from))
}

export function fetchEntry (type, id) {
  return globalThis.$.query($ => $[type].getLatestRevision(id)) // this needs to be handled, does not return { data }
}

export function fetchRevision (type, id) {
  return globalThis.$.query($ => $[type].getRevision(id))
}

export function fetchEntryRevisions (type, id) {
  return globalThis.$.query($ =>
    $[type]
      .getRevisions(id)
      .data(({ document, data, ...rest }) => rest)
  )
}
