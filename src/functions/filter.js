const filter = (timeout, input, setfilter, setarraylist, list, parameter) => {
  clearTimeout(timeout);
  document.getElementById(input).focus();
  let search = document.getElementById(input).value.toUpperCase();
  timeout = setTimeout(() => {
    // eslint-disable-next-line
    if (search == '') {
      setfilter('');
      setarraylist(list);
      document.getElementById(input).value = '';
      setTimeout(() => {
        document.getElementById(input).focus();
      }, 100);
    } else {
      setfilter(document.getElementById(input).value.toUpperCase());
      setarraylist(list.filter(parameter));
      document.getElementById(input).value = search;
      setTimeout(() => {
        document.getElementById(input).focus();
      }, 100);
    }
  }, 1000);
}

export default filter;
