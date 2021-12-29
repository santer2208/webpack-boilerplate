class Base {
  constructor(resources) {
    this.resources = resources
    let cfull = `{{call}}${this.resources.settings.mixinNames.container}-full()`
    let clfix = `{{call}}${this.resources.settings.mixinNames.clearfix}()`
    let roff = `{{call}}${this.resources.settings.mixinNames.rowOffsets}()`
    let coffMargin = `{{call}}${this.resources.settings.mixinNames.columnOffsets}(margin)`
    let coffPadding = `{{call}}${this.resources.settings.mixinNames.columnOffsets}(padding)`

    this.content = {
      container: {
        'max-width': this.resources.settings.container.maxWidth,
        margin: '0 auto',
        [cfull]: null,
      },
      row: {
        display: 'flex',
        'flex-wrap': 'wrap',
        [roff]: null,
      },
      rowFloat: {
        [roff]: null,
        [clfix]: null,
      },
      rowInlineBlock: {
        [roff]: null,
      },
      column: {
        // 'box-sizing': "border-box",
        'word-wrap': 'break-word',
        [coffMargin]: null,
      },
      columnPadding: {
        'word-wrap': 'break-word',
        [coffPadding]: null,
      },
      columnFloat: {
        float: 'left',
      },
      columnInlineBlock: {
        display: 'inline-block',
        'vertical-align': 'top',
      },
    }
  }

  render() {
    let out = ''

    let containerFull = {
      // 'padding-left': "{{var}}fields",
      // 'padding-right': "{{var}}fields"
      'padding-left': 'var(--fields)',
      'padding-right': 'var(--fields)',
    }

    let rowOffsets = {
      // 'margin-left': "({{var}}offset_one_side * -1)",
      // 'margin-right': "({{var}}offset_one_side * -1)"
      'margin-left': 'calc(var(--offset) / -2)',
      'margin-right': 'calc(var(--offset) / -2)',
    }

    let offsetGet = this.resources.settings.offset.split(/(\d+)/)
    let colOffsets = {
      // '{{string-var}}type{{/string-var}}-left': "{{var}}offset_one_side",
      // '{{string-var}}type{{/string-var}}-right': "{{var}}offset_one_side"
      // '{{string-var}}type{{/string-var}}-left': `${offsetGet[1]/2}${offsetGet[2]}`,
      // '{{string-var}}type{{/string-var}}-right': `${offsetGet[1]/2}${offsetGet[2]}`
      '{{string-var}}type{{/string-var}}-left': 'calc(var(--offset) / 2)',
      '{{string-var}}type{{/string-var}}-right': 'calc(var(--offset) / 2)',
    }

    let containerStyles = ''
    let rowStyles = ''
    let colStyles = ''

    let cont = this.resources.styles.objToStyles(containerFull, 1)
    let row = this.resources.styles.objToStyles(rowOffsets, 1)
    let col = this.resources.styles.objToStyles(colOffsets, 1)

    let media = new this.resources.media()

    containerStyles += media.wrap(cont)
    rowStyles += media.wrap(row)
    colStyles += media.wrap(col)

    for (let name in this.resources.settings.breakPoints) {
      let point = this.resources.settings.breakPoints[name]

      if (point.fields !== undefined) {
        containerStyles +=
          '\n\n' +
          this.resources.styles.objToCallMedia(
            name + '-block',
            {
              // 'padding-left': "{{var}}fields_" + name,
              // 'padding-right': "{{var}}fields_" + name
              'padding-left': 'var(--fields-' + name + ')',
              'padding-right': 'var(--fields-' + name + ')',
            },
            1
          )
      }

      if (point.offset !== undefined) {
        rowStyles +=
          '\n\n' +
          this.resources.styles.objToCallMedia(
            name + '-block',
            {
              // 'margin-left': `({{var}}offset_${name}_one_side * -1)`,
              // 'margin-right': `({{var}}offset_${name}_one_side * -1)`
              'margin-left': `-${offsetGet[1] / 2}${offsetGet[2]}`,
              'margin-right': `-${offsetGet[1] / 2}${offsetGet[2]}`,
            },
            1
          )

        colStyles +=
          '\n\n' +
          this.resources.styles.objToCallMedia(
            name + '-block',
            {
              // '{{string-var}}type{{/string-var}}-left': `{{var}}offset_${name}_one_side`,
              // '{{string-var}}type{{/string-var}}-right': `{{var}}offset_${name}_one_side`
              '{{string-var}}type{{/string-var}}-left': `var(--offset-${name}-one-side)`,
              '{{string-var}}type{{/string-var}}-right': `var(--offset-${name}-one-side)`,
            },
            1
          )
      }
    }

    let mixinWrapper = new this.resources.mixin(
      this.resources.patterns.mixin,
      this.resources.settings.mixinNames.container + '-full',
      '',
      containerStyles
    )
    out += mixinWrapper.render(this.resources.settings.outputStyle) + '\n\n'

    let mixinRow = new this.resources.mixin(
      this.resources.patterns.mixin,
      this.resources.settings.mixinNames.rowOffsets,
      '',
      rowStyles
    )
    out += mixinRow.render(this.resources.settings.outputStyle) + '\n\n'

    let mixinCol = new this.resources.mixin(
      this.resources.patterns.mixin,
      this.resources.settings.mixinNames.columnOffsets,
      '{{var}}type',
      colStyles
    )
    out += mixinCol.render(this.resources.settings.outputStyle) + '\n\n'

    for (let name in this.resources.settings.mixinNames) {
      if (this.content[name] !== undefined) {
        let selector = this.resources.settings.mixinNames[name]
        let styles = this.resources.styles.objToStyles(this.content[name], 1)
        let media = new this.resources.media()
        let mixin = new this.resources.mixin(
          this.resources.patterns.mixin,
          selector,
          '',
          media.wrap(styles)
        )

        out += mixin.render() + '\n\n'
      }
    }

    return out
  }
}

module.exports = Base
