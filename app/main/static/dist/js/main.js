if (location.pathname.indexOf("/") !== -1) {
    //게시글 상세보기
    $("#club_main li").on('click', function() {
      var bdid = $(this).data('bdid');
      if (bdid != null) {
        location.href="/boards/"+bdid;
      }
     });

 }


if (location.pathname.indexOf("/club") !== -1) {
    //게시글 상세보기
    $("#table-club tr").on('click', function() {
      var bdid = $(this).data('bdid');
      if (bdid != null) {
        //console.log(bdid);
        location.href="/boards/"+bdid;
      }
    });

    //검색
    $("#btn-search-club").on('click', function () {
      var area = $("select[name='areas']").val();
      var sport = $("select[name='sports']").val();
      var search_keyword = $("input[name='name']").val()
      var querystring = "";
      console.log(area)
      console.log(sport)
      console.log(search_keyword)
      if( area != "") {
        querystring += "area=" + area;
      }
      if ( sport != "") {
        querystring += "&sport=" + sport;
      }
      if ( search_keyword != "") {
        querystring += "&search_keyword=" + search_keyword;
      }
      console.log(querystring);

       location.href = "/club?" + querystring;


    });

 }

// if (location.pathname.indexOf("/filter") !== -1) {
//    //게시글 상세보기
//    $("#table-club tr").on('click', function() {
//      var bdid = $(this).data('bdid');
//      if (bdid != null) {
//        //console.log(bdid);
//        location.href="/boards/"+bdid;
//      }
//    });



