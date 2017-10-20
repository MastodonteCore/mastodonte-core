import './plugins/jquery';
import { deletePdf } from './pdf';
import { addField, removeField } from './scraping';

$(document).ready(function() {
  // Pdf
  $(document).on('click', '#btnPdfDelete', deletePdf)

  // Scraping
  $(document).on('click', '#addField', addField)
  $(document).on('click', '.btn-remove-field', removeField)
})