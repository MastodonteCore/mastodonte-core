const notifyDefaultOptions = {
  globalPosition: 'top center',
  className: 'success',
  gap: 8
}

$(document).ready(function () {
  $(document).on('click', '#btnPdfDelete', handleDeletePdfs)
})

function handleDeletePdfs() {
  const pdfs = getPdfSelected();

  ajaxDeletePdf(pdfs)
}

function getPdfSelected() {
  let pdfs = [];

  $('input[type="checkbox"]:checked').each((i, el) => pdfs.push($(el).val()));

  return pdfs;
}

function ajaxDeletePdf(pdfs) {
  if (pdfs.length > 0) {
    $.ajax({
      url: '/pdf/delete',
      type: 'DELETE',
      headers: {
        'X-CSRF-Token': _csrf
      },
      data: { pdfs }
    })
    .done((data) => successDeleteCallback(pdfs, data))
    .fail((data) => errorDeleteCallback(data))
  }
}

function successDeleteCallback(pdfs, message) {
  removeElementsPdf(pdfs)
  $.notify(message, notifyDefaultOptions)
} 

function errorDeleteCallback(message) {
  $.notify(message, Object.assign({}, notifyDefaultOptions, {
    className: 'error'
  }))
}

function removeElementsPdf(pdfs) {
  if (Array.isArray(pdfs) && pdfs.length > 0 ) {
    pdfs.forEach(pdf => $(`input[value="${pdf}"]`)
      .closest('tr').remove())
  }
}