export function fetchTaxonomies(type, { offset, limit, where, filter } = {}) {
  return globalThis.$.query($ => $[type]
    .latest(filter)
    .find(where)
    .skip(offset)
    .limit(limit)
    .meta({
      total: $[type]
        .latest(filter)
        .find(where)
        .count()
    })
    .data()
  )
}

export function createTaxonomy(type, payload) {
  return globalThis.$.query($ => $[type].createDocument(payload))
}

export function updateTaxonomy(type, { document: { id }, data, revision: { id: from } }) {
  return globalThis.$.query($ => $[type].createRevision(id, data, { from }))
}

export function fetchTaxonomy(type, id) {
  return globalThis.$.query($ =>
    $[type]
      .latest({ id })
      .data()
  )
}

export function archiveTaxonomy(type, id, archived) {
  return globalThis.$.query($ =>
    $[type]
      .archive(id, archived)
  )
}
