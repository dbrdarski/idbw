export function fetchEntries(type, { offset, limit, where } = {}) {
  return globalThis.$.query($ => {
    console.log("Q", { $, type })
    return $[type]
      .activeRevisions()
      // .get()
      // .lastest({ published: true })
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

export function createEntry(type, payload) {
  return globalThis.$.query($ => $[type].createDocument(payload))
}

export function updateEntry(type, { document: { id }, record, revision: { id: from } }) {
  return globalThis.$.query($ => $[type].createRevision(id, record, from))
}

export function fetchEntry(type, id) {
  return globalThis.$.query($ => $[type].getLatestRevision(id)) // this needs to be handled, does not return { data }
  // .get({ id }).latest()
}

export function fetchRevision(type, id) {
  return globalThis.$.query($ => $[type].getRevision(id)) // .get({ id, revision: true })
}

export function fetchEntryRevisions(type, id) {
  return globalThis.$.query($ =>
    $[type]
      .getRevisions(id)
      // .get({ id })
      // .all()
      .data(({ document, data, ...rest }) => rest)
  )
}

// open questions:
// Tightly coupled query where existing .data(). ids(), additionally meta() should be used to build the response
// - OR -
// A more open approach like the one I have right now.
