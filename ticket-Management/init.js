let filterCodes={
    "blue": "#00a8ff",
    "yellow":"#fbc531",
    "green":"#4cd137",
    "black":"#2f3640",
}
let ticketContent=document.querySelector(".tickets-content");
let openModal=document.querySelector(".open-modal");
let closeModal=document.querySelector(".close-modal");

let activeModalFilter="black";


function initTickets(){
    let allTickets=JSON.parse(localStorage.getItem("allTickets"));
    if(!allTickets){
        localStorage.setItem("allTickets",JSON.stringify([]));
       return ;
    }
    //if tickets are present

    for(let i=0;i<allTickets.length;i++){
        let ticketObj=allTickets[i];
        // let sta=ticketObj.status;
        //console.log(sta);
        appendTicketToUi(ticketObj);
    }
}
initTickets();

//if tickets are present in local storage then this function will append all the tickets to ui
function appendTicketToUi(ticketObj){
    let {ticketId,ticketText,ticketFilter,status}=ticketObj;
    let ticketDiv=document.createElement("div");
    ticketDiv.classList.add("ticket");
//     <div class="ticket">
   
// </div>
{/* <span class="base" th:classappend="${condition ? 'condition-true' : 'condition-false'}">
   This HTML is consolidated, and the conditional class is appended separately from the static base class.
</span> */}
{/* <span th:class="'base '+${condition ? 'condition-true' : 'condition-false'}">
   The base CSS class still has to be appended with String concatenation. We can do a little bit better.
</span> */}
    ticketDiv.innerHTML=` <div id=${ticketId} class="ticket-filter ${ticketFilter}" ></div>
    <div class="ticket-content">
        <div class="ticket-info"> 
        <div class="ticket-id">#${ticketId}</div>
        
        <div class="lock-unlock" >
        <i id=${ticketId} class="fas ${status=="unlocked"?'fa-unlock-alt':'fa-lock'} ${ticketFilter}"  status=${status}></i> 
        </div>
        <div class="ticket-delete "> 
        <i id=${ticketId} class="fas fa-trash-alt ${ticketFilter}"></i>  
         </div>
        </div>
        <div class="ticket-text">${ticketText}</div>
    </div>`;


    //toggle filter color 
    ticketDiv.querySelector(".ticket-filter").addEventListener("click",function(e){
        
        //if status is locked we can't toogle the filter of the ticket 
         let attribute=ticketDiv.querySelector(".fas").getAttribute("status");
         if(attribute=="locked"){
             //console.log("ticket is locked");
            
             return;
         }
        let arr=["blue","yellow","green","black"];
        let currentfilter=e.target.classList[1];
        let idx=arr.indexOf(currentfilter);
        idx++;
        idx=idx%4;
        //change color of lock and trash with the change in color of ticket filter
        ticketDiv.querySelector(".ticket-delete").querySelector(".fas").classList.remove(currentfilter);
        ticketDiv.querySelector(".lock-unlock").querySelector(".fas").classList.remove(currentfilter);
        ticketDiv.querySelector(".lock-unlock").querySelector(".fas").classList.add(arr[idx]);
        ticketDiv.querySelector(".ticket-delete").querySelector(".fas").classList.add(arr[idx]);
        // console.log(delIconcolor);
        // console.log(lockIconcolor);
       // console.log(idx);
       //change in ui
        e.target.classList.remove(currentfilter);
        e.target.classList.add(arr[idx]);
        //change in local storage
        let ticketid=e.target.id;
        let allTickets=JSON.parse(localStorage.getItem("allTickets"));
        for(let i=0;i<allTickets.length;i++){
            if(allTickets[i].ticketId==ticketid){
                allTickets[i].ticketFilter=arr[idx];

                break;
            }
        }
        localStorage.setItem("allTickets",JSON.stringify(allTickets));
     })

    //delete ticket
    ticketDiv.querySelector(".ticket-delete").addEventListener("click",function(e){
        let ticketid=e.target.id;
        //remove ticket from UI
        ticketDiv.remove(); 
        //how this function have a access of ticketDiv because of closure

        let allTickets=JSON.parse(localStorage.getItem("allTickets"));

        let filteredTickets=allTickets.filter(function(ticketObj){
            return ticketObj.ticketId!=ticketid;
        })
        localStorage.setItem("allTickets",JSON.stringify(filteredTickets));
    })
    //lock unlock ticket
    ticketDiv.querySelector(".lock-unlock").addEventListener("click",function(e){
        console.log(e);
        let colorclass=e.target.classList[2];
        if(e.target.getAttribute("status")=="unlocked"){  
           e.target.className="fas fa-lock ";
           e.target.className+=colorclass;    
           e.target.setAttribute("status","locked");
           ticketDiv.querySelector(".ticket-filter").setAttribute("onclick","alert('Ticket is Locked!!')");
           //change status in local storage
           let ticketid=e.target.id;
           let allTickets=JSON.parse(localStorage.getItem("allTickets"));
          for(let i=0;i<allTickets.length;i++){
              if(allTickets[i].ticketId==ticketid){
                  allTickets[i].status="locked";
                  break;
              }
          }
          localStorage.setItem("allTickets",JSON.stringify(allTickets));
          
         }else{
            e.target.className="fas fa-unlock-alt ";  
            e.target.className+=colorclass;  
            e.target.setAttribute("status","unlocked");
            ticketDiv.querySelector(".ticket-filter").removeAttribute("onclick");
             //change status in local storage
            let ticketid=e.target.id;
            let allTickets=JSON.parse(localStorage.getItem("allTickets"));
           for(let i=0;i<allTickets.length;i++){
               if(allTickets[i].ticketId==ticketid){
                   allTickets[i].status="unlocked";
                   break;
               }
           }
           localStorage.setItem("allTickets",JSON.stringify(allTickets));
         }
    })

    ticketContent.append(ticketDiv);
}
// {/* <i class="fad fa-lock-alt"></i> */}
{/* <i class="fas fa-lock"></i> */}