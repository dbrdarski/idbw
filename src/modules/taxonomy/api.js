export function fetchTaxonomies (type, { offset, limit, where } = {}) {
return globalThis.$.query($ => $[type]
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
    .data()
  )
}

export function createTaxonomy (type, payload) {
  return globalThis.$.query($ => $[type].createDocument(payload))
}

export function updateTaxonomy (type, { document: { id }, data, revision: { id: from }}) {
  return globalThis.$.query($ => $[type].createRevision(id, data, from))
}

export function fetchTaxonomy (type, id) {
  return globalThis.$.query($ => $[type].getActiveRevision(id))
}
