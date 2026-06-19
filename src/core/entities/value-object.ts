export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObject<Props>) {
    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
