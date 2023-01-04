export function fetchTaxonomies (type, { offset, limit, where } = {}) {
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

export function createTaxonomy (type, payload) {
  return window.$.query($ => $[type].createDocument(payload))
}

export function updateTaxonomy (type, { document: { id }, data, revision: { id: from }}) {
  return window.$.query($ => $[type].createRevision(id, data, from))
}

export function fetchTaxonomy (type, id) {
  return window.$.query($ => $[type].getActiveRevision(id))
}
