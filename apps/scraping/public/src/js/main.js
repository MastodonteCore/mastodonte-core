$(document).ready(function () {
  // Scraping
  $(document).on('click', '#addField', addField)
  $(document).on('click', '.btn-remove-field', removeField)
})

export function addField() {
  const $this = $(this)
  const $parent = $this.closest('.form-group')
  const nbUnique = $('input[name^="unique"]').length;

  $parent.before(`
    <div class="form-group">
      <div class="row">
        <div class="col-md-3">
          <input type="text" name="field[]" class="form-control" placeholder="Selector"/>
        </div>
        <div class="col-md-3">
          <select class="form-control" name="typeField[]">
            <option value="html">Html</option>
            <option value="text">Text</option>
            <option value="link">Link</option>
          </select>
        </div>
        <div class="col-md-3">
          <input type="text" name="parent[]" class="form-control" placeholder="Parent selector"/>
        </div>
        <div class="col-md-2">
          <div class="checkbox">
            <label>
              <input type="checkbox" name="unique[]" value="${nbUnique}"/> Unique
            </label>
          </div>
        </div>
        <div class="col-md-1 text-right">
          <button class="btn btn-warning btn-remove-field"><i class="fa fa-times"></i></button>
        </div>
      </div>
    </div>
  `)
}

export function removeField() {
  const $this = $(this)
  const $parent = $this.closest('.form-group')

  $parent.remove()
  $('input[name^="unique"]').each((i, el) => $(el).val(`${i}`))
}