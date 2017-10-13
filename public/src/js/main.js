import './plugins/jquery';
import { addField, removeField } from './scraping';

$(document).ready(function() {
  // Scraping
  $(document).on('click', '#addField', addField)
  $(document).on('click', '.btn-remove-field', removeField)
})