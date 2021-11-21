function setCookie(cookieName, value, exdays){
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
  document.cookie = cookieName + "=" + cookieValue;
}

function deleteCookie(cookieName){
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() - 1);
  document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

function getCookie(cookieName) {
  cookieName = cookieName + '=';
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cookieName);
  var cookieValue = '';
  if(start != -1){
      start += cookieName.length;
      var end = cookieData.indexOf(';', start);
      if(end == -1)end = cookieData.length;
      cookieValue = cookieData.substring(start, end);
  }
  return unescape(cookieValue);
}

function queryStringToJSON(queryString) {
  if(queryString.indexOf('?') > -1){
    queryString = queryString.split('?')[1];
  }
  var pairs = queryString.split('&');
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return result;
}

function getUrlParams() {
  var params = {};
  decodeURI(window.location.search).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
  return params;
}

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
}

// 숫자 타입에서 쓸 수 있도록 format() 함수 추가
Number.prototype.format = function(){
  if(this==0) return 0;

  var reg = /(^[+-]?\d+)(\d{3})/;
  var n = (this + '');

  while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

  return n;
};

// 문자열 타입에서 쓸 수 있도록 format() 함수 추가
String.prototype.format = function(){
  var num = parseFloat(this);
  if( isNaN(num) ) return "0";

  return num.format();
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function urldecode(str) {
  return decodeURIComponent((str + '')
      .replace(/%(?![\da-f]{2})/gi, function() {
          return '%25';
      })
      .replace(/\+/g, '%20'));
}

function parseSelect(row, initvalue, key) {
  var roleSelector = $(row).find('td.'+key+' > select[name=rolename]');

  $(roleSelector).select2({
    placeholder: "역할명을 검색해주세요",
    ajax: {
      url: function (params) {
        if(params.term)
          return '/api/v1/artist/roles/' + params.term;
        else
          return '/api/v1/artist/roles/';
      },
      processResults: function (data) {   
        $.each(data, function (index, item) {
          data[index].id = item[0]+","+item[1]
          data[index].text = item[1]
        });
        return {
          results: data
        };
      }
    }
  });
  if(initvalue != "") {
    $.ajax({
        type: 'GET',
        url: '/api/v1/artist/roles/' + initvalue,
    }).then(function (data) {
      if(data.length > 0) {
        $.each(data, function (index, item) {
          data[index].id = item[0]+","+item[1]
          data[index].text = item[1]
        });

        
        // create the option and append to Select2
        var option = new Option(data[0].text, data[0].id, true, true);
        roleSelector.append(option).trigger('change');
        roleSelector.val(data[0].id).trigger('change');
        // manually trigger the `select2:select` event
        roleSelector.trigger({
          type: 'select2:select',
          params: {
            data: data[0]
          }
        });
      }
    });
  }
}

var bulkHeader = [
  "LABEL: Name",
  "ALBUM: Type Name",
  "ALBUM: Title",
  "ALBUM: Sub Title",
  "ALBUM: Description",
  "ALBUM: Keywords",
  "ALBUM: Styles",
  "ALBUM: Release Date",
  "ALBUM: Artwork Filename",
  "TRACK: Title",
  "TRACK: Sub Title",
  "TRACK: Description",
  "TRACK: Number",
  "TRACK: Disk Number",
  "TRACK: Duration",
  "TRACK: BPM",
  "TRACK: Genre",
  "TRACK: Instrumentation",
  "TRACK: Keywords",
  "TRACK: Composer(s)",
  "TRACK: Publisher(s)",
  "TRACK: Artist(s)",
  "TRACK: Audio Filename",
  "TRACK: Mood",
  "ARTIST:1: Role Name",
  "ARTIST:2: Name",
  "ARTIST:2: Role Name",
  "ARTIST:3: Name",
  "ARTIST:3: Role Name",
  "ARTIST:4: Name",
  "ARTIST:4: Role Name",
  "WRITER:1: Name",
  "WRITER:1: IPI",
  "WRITER:1: Type",
  "WRITER:2: Name",
  "WRITER:2: IPI",
  "WRITER:2: Type",
  "WRITER:3: Name",
  "WRITER:3: IPI",
  "WRITER:4: Type",
  "WRITER:4: Name",
  "WRITER:4: IPI",
  "WRITER:4: Type",
  "WRITER:5: Name",
  "WRITER:5: IPI",
  "WRITER:5: Type",
  "WRITER:6: Name",
  "WRITER:6: IPI",
  "WRITER:6: Type",
  "WRITER:7: Name",
  "WRITER:7: IPI",
  "WRITER:7: Type",
  "WRITER:8: Name",
  "WRITER:8: IPI",
  "WRITER:8: Type",
  "WRITER:9: Name",
  "WRITER:9: IPI",
  "WRITER:9: Type",
  "WRITER:10: Name",
  "WRITER:10: IPI",
  "WRITER:10: Type",
  "WRITER:11: Name",
  "WRITER:11: IPI",
  "WRITER:11: Type",
  "WRITER:12: Name",
  "WRITER:12: IPI",
  "WRITER:12: Type",
  "WRITER:13: Name",
  "WRITER:13: IPI",
  "WRITER:13: Type",
  "WRITER:14: Name",
  "WRITER:14: IPI",
  "WRITER:14: Type",
  "WRITER:15: Name",
  "WRITER:15: IPI",
  "WRITER:15: Type",
  "WRITER:16: Name",
  "WRITER:16: IPI",
  "WRITER:16: Type",
  "WRITER:17: Name",
  "WRITER:17: IPI",
  "WRITER:17: Type",
  "원청출판사(OP): Name",
  "원청출판사(OP): Society",
  "하청출판사(SP): Name",
  "하청출판사(SP): Society",
  "CODE: ISWC",
  "CODE: ISRC",
  "CODE: KOMCA",
  "CODE: KOSCAP",
];
