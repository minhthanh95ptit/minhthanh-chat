function videoChat(divId){
  $(`#video-chat-${divId}`).unbind("click").on("click", function(){
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    // console.log(targetId);
    // console.log(callerName);

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    }

   // console.log(dataToEmit);
   //Step 01 of Caller
   socket.emit("caller-check-listener-online-or-not", dataToEmit);

  })
}

$(document).ready(function(){
  //Step 02 of caller
  socket.on("server-send-listener-is-offline", function(){
    alertify.notify("Người dùng này hiện không trưc tuyến", "error", 7)
  })

  let getPeerId = "";
  const peer = new Peer();
  // console.log(peer);
  peer.on("open", function(peerId){
    getPeerId = peerId;
  });
  // console.log(getPeerId); 
  //Step 03
  socket.on("server-request-peer-id-of-listener", function(response){
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenPeerId: getPeerId
    };

    // console.log(dataToEmit);
    // console.log(listenPeerId)
    //Step 04
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);

  });

  //Step 05 of Caller
  socket.on("server-send-peer-id-of-listener-to-caller", function(response){
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenPeerId: response.listenPeerId
    };

    //Step 06 of Caller
    socket.emit("caller-request-call-to-server", dataToEmit);
  
    let timeInterval;
    // console.log("HUHU");
    Swal.fire({ 
      title: `Đang gọi cho <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `Thời gian <strong style="color: #d43f3a;"></strong> <br/></br/>
          <button id="btn-cancel-call" class="btn btn-danger">
            Hủy cuộc gọi
          </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem", //const 32rem
      allowOutsideClick: false,
      timer: 30000, //30 second
      onBeforeOpen: () =>{
        $("#btn-cancel-call").unbind("click").on("click", function(){
          Swal.close();
          clearInterval(timeInterval);

          //Step 07 of caller:
          socket.emit("calller-cancel-request-call-to-server", dataToEmit);

        });
        Swal.showLoading()
        timeInterval = setInterval(() =>{
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
        }, 1000);
      },
      onOpen:() =>{
        //Step 12 of caller
        socket.on("server-send-reject-call-to-caller", function(response){
          Swal.close();
          clearInterval(timeInterval);
          
          Swal.fire({
            type: "info",
            title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; Đang bận`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            with: "52rem",
            allowOutsideClick: false, 
            confirmButtonColor: "#2eCC71",
            confirmButtonText: "Xác nhận"
          });
        })

        socket.on("server-send-accept-call-to-caller", function(response){
          Swal.close();
          clearInterval(timeInterval);

          console.log("Caller OKKKKKK....")
        })

      },
      onClose: () =>{
        clearInterval(timeInterval)
      }
    }).then((result) =>{
      return false;
    });
  });
  //Step 08 of Listener
  socket.on("server-send-request-call-to-listener", function(response){
  let dataToEmit = {
    callerId: response.callerId,
    listenerId: response.listenerId,
    callerName: response.callerName,
    listenerName: response.listenerName,
    listenPeerId: response.listenPeerId
  };

  let timeInterval;
  // console.log("HUHU");
  Swal.fire({ 
    title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; đang gọi cho  bạn <i class="fa fa-volume-control-phone"></i>`,
    html: `Thời gian <strong style="color: #d43f3a;"></strong> <br/></br/>
        <button id="btn-reject-call" class="btn btn-danger">
          Từ Chối
        </button>
        <button id="btn-accept-call" class="btn btn-success">
          Đồng Ý.
        </button>
    `,
    backdrop: "rgba(85, 85, 85, 0.4)",
    width: "52rem", //const 32rem
    allowOutsideClick: false,
    timer: 30000, //30 second
    onBeforeOpen: () =>{
      $("#btn-reject-call").unbind("click").on("click", function(){
        Swal.close();
        clearInterval(timeInterval);

        //Step 07 of caller:
        socket.emit("listener-reject-request-call-to-server", dataToEmit);

      });

      $("#btn-accept-call").unbind("click").on("click",function() {
        Swal.close();
        clearInterval(timeInterval);

        // step 11 of listener
        socket.emit("listener-accept-request-call-to-server", dataToEmit);
      });

      Swal.showLoading()
      timeInterval = setInterval(() =>{
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
      }, 1000);
    },
    onOpen: () =>{
      socket.on("server-send-cancel-request-call-to-listener", function(response) {
        Swal.close();
        clearInterval(timeInterval);
      });

      socket.on("server-send-accept-call-to-listener", function (response) { 
        Swal.close();
        clearInterval(timeInterval);
        //
      })

    },
    onClose: () =>{
      clearInterval(timeInterval)
    }
  }).then((result) =>{
    return false;
  });
  })

  //Step 09



});