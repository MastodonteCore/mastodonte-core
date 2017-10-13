export function addField() {
  const $this = $(this)
  const $parent = $this.closest('.form-group')
  
  $parent.before(`
    <div class="form-group">
      <div class="col-sm-offset-1 col-sm-3">
        <input type="text" name="field[]" class="form-control" placeholder="Selector"/>
      </div>
      <div class="col-sm-3">
        <select class="form-control" name="typeField[]">
          <option value="html">Html</option>
          <option value="text">Text</option>
        </select>
      </div>
      <div class="col-sm-3">
        <input type="text" name="parent[]" class="form-control" placeholder="Parent selector"/>
      </div>
      <div class="col-sm-2 text-right">
        <button class="btn btn-warning btn-remove-field"><i class="fa fa-times"></i></button>
      </div>
    </div>
  `)
}

export function removeField() {
  const $this = $(this)
  const $parent = $this.closest('.form-group')

  $parent.remove()
}