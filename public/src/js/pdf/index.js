export function deletePdf() {
  let pdfs = [];

  $('input[type="checkbox"]:checked').map((i, el) => pdfs.push($(el).val()))
  
  if (pdfs.length > 0) {
    $.ajax({ 
      url: '/pdf/api/delete', 
      type: 'POST', 
      headers: {
        'X-CSRF-Token': _csrf
      },
      data: { pdfs }
    })
    .done(() => {
      location.reload(true)
    })
  }
}