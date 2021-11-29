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
    $("#club-list tr").on('click', function() {
      var bdid = $(this).data('bdid');
      if (bdid != null) {
        //console.log(bdid);
        location.href="/boards/"+bdid;
      }
    });

 }