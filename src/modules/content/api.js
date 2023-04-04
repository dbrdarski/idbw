export function fetchEntries (type, { offset, limit, where } = {}) {
  return window.$.query($ => [
    $[type]
      .activeRevisions()
      .find(where)
      .count(),
    $[type]
      .activeRevisions()
      .find(where)
      .skip(offset)
      .limit(limit)
      .data()
    ]
  )
}

export function fetchEntriesAlt (type, { offset, limit, where } = {}) {
  return window.$.query($ => $[type]
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
    .include("tag", "category")
    .data2()
  )
}

export function fetchEntriesAlt2 (type, { offset, limit, where } = {}) {
  return window.$.query($ => {
    const baseQuery = $[type]
      .activeRevisions()
      .find(where)
    return baseQuery
      .skip(offset)
      .limit(limit)
      .meta({
        total: baseQuery.count()
      })
      .data2()
  })
}

export function createEntry (type, payload) {
  return window.$.query($ => $[type].createDocument(payload))
}

export function updateEntry (type, { document: { id }, data, revision: { id: from }}) {
  return window.$.query($ => $[type].createRevision(id, data, from))
}

export function fetchEntry (type, id) {
  console.log("fetchEntry", type, id)
  return window.$.query($ => $[type].getLatestRevision(id))
}

export function fetchRevision (type, id) {
  return window.$.query($ => $[type].getRevision(id))
}

export function fetchEntryRevisions (type, id) {
  return window.$.query($ =>
    $[type]
      .getRevisions(id)
      .data(({ document, data, ...rest }) => rest)
  )
}
