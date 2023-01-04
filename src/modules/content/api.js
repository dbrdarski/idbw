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
      .data(({
        data,
        document,
        ...rest
      }) => ({
        ...document,
        data
      }))
    ]
  )
}

export function createEntry (type, payload) {
  return window.$.query($ => $[type].createDocument(payload))
}

export function updateEntry (type, { document: { id }, data, revision: { id: from }}) {
  return window.$.query($ => $[type].createRevision(id, data, from))
}

export function fetchEntry (type, id) {
  return window.$.query($ => $[type].getActiveRevision(id))
}
