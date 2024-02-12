export const capsule = {}

export const provide = (definition) => {
  for (const [key, value] of Object.entries(definition)) {
    if (capsule.hasOwnProperty(key)) {
      throw Error(`'${key}' is already defined in capsule`);
    }
    Object.defineProperty(capsule, key, { value, enumerable: true })
  }
}

export const init = () => Object.freeze(capsule)
