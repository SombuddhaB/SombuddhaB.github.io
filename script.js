document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const search=document.querySelector('#publication-search');
if(search){const items=[...document.querySelectorAll('#publication-list > li')];const status=document.querySelector('#search-status');search.addEventListener('input',()=>{const term=search.value.trim().toLowerCase();let count=0;items.forEach(item=>{item.hidden=!item.textContent.toLowerCase().includes(term);if(!item.hidden)count++;});status.textContent=`${count} of ${items.length} entries shown.`;});}
