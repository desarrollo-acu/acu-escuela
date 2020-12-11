export  class Actions {
  constructor(
    public tooltip?: string,
    public mode?: string,
    public className?: string,
    public tooltipClassName?: string,
    public icon?: string,

    public backgroundColor?: string,
    public color?: string,

    public tooltipBackgroundColor?: string,
    public tooltipTextColor?: string,

    // tslint:disable-next-line: ban-types
    public callback?: any,
    public title?: any
  ) {}
}



