export interface Parameter {
  id: string
  parameterValue: string
  description?: string
  groupName?: string
}

export class ParameterList {
  private parameters: Parameter[]

  constructor(parameters: Parameter[]) {
    this.parameters = parameters
  }

  public get(id: string) {
    const found = this.parameters.find((x) => x.id === id)
    if (found !== undefined && found !== null) {
      return found.parameterValue
    }
    return undefined
  }

  public remove(id: string) {
    const found = this.parameters.find((x) => x.id === id)
    if (found !== undefined && found !== null) {
      const index = this.parameters.indexOf(found)
      this.parameters.splice(index, 1)
    }
  }
}
