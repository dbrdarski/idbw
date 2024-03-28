export function testRelationships(rel, ...ids) {
  return globalThis.$.query(
    $ => $.post.testRelationships(rel, ...ids)
  )
}

export function fetchEntries(type, { offset, limit, where, filter } = {}) {
  return globalThis.$.query(
    $ => $[type]
      .latest(filter)
      // .latest({
      //   rel: post => post.tag.name(1,2,3,4)
      // })
      // .get()
      // .lastest({ published: true })
      .find(where)
      .skip(offset)
      .limit(limit)
      .meta({
        total: $[type]
          .latest(filter)
          .find(where)
          .count()
      })
      .include(($, post) => $(
        post.tag,
        post.category
      ))
      .data()
  )
}

export function createEntry(type, payload) {
  return globalThis.$.query($ => $[type].createDocument(payload))
}

export function updateEntry(type, { document: { id }, record, revision: { id: from } }) {
  return globalThis.$.query($ => $[type].createRevision(id, record, { from }))
}

export function fetchEntry(type, id) {
  return globalThis.$.query($ =>
    $[type]
      .latest({ id })
      .data()
  )
  // return globalThis.$.query($ => $[type].getLatestRevision(id)) // this needs to be handled, does not return { data }
}

export function fetchRevision(type, id) {
  return globalThis.$.query($ =>
    $[type].revision({ id })
      .data()
  ) // .get({ id, revision: true })
}

export function fetchEntryRevisions(type, id) {
  return globalThis.$.query($ =>
    $[type]
      .revisions({ id })
      .data(({ document, record, ...rest }) => rest)
  )
}

export function archiveEntry(type, id, archived) {
  return globalThis.$.query($ =>
    $[type]
      .archive(id, archived)
  )
}
// open questions:
// Tightly coupled query where existing .data(). ids(), additionally meta() should be used to build the response
// - OR -
// A more open approach like the one I have right now.
