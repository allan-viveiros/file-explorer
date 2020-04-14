//Look for children of tbody
const children = $('tbody').children();

//Convert children in a array
let children_array = [];
for(let i=0; i<children.length; i++){
    children_array.push(children[i]);
}
console.log(children_array);

//build an array of object
const items = [];
children_array.forEach(element => {
    // console.log(element.outerHTML);
    // console.log(element.getAttribute('data-name'));
    // console.log(element.getAttribute('data-size'));
    // console.log(element.getAttribute('data-time'));

    const rowDetails = {
        name: element.getAttribute('data-name'),
        size: parseInt(element.getAttribute('data-size')),
        time: parseInt(element.getAttribute('data-time')),
        html: element.outerHTML
    }
    items.push(rowDetails);
    //console.log(items);

    //Sort status
    const sortStatus = {
        name: 'none', //none, up, down
        size: 'none',
        time: 'none'
    };

    //Function to do a sort by the name ascending
    const sort_header = (items, option, type) => {
        items.sort((item1, item2) => {
            let value1, value2;

            if(type === 'name'){
                value1 = item1.name.toUpperCase();
                value2 = item2.name.toUpperCase();

            }else if(type === 'size'){
                value1 = item1.size;
                value2 = item2.size;

            }else{
                value1 = item1.time;
                value2 = item2.time;
            }

            if(value1 < value2){
                return -1;                
            }
            if(value1 > value2){
                return 1;
            }            
            return 0;
        });
        if(option === 'down'){ items.reverse(); }
    }   
    //console.log(items);

    //Fill table body with items sorted
    const fill_table_body = items => {
        const content = items.map(element => element.html).join('');
        console.log(content);
        $('tbody').html(content);
    }

    //Event listener
    document.getElementById('table_head_row').addEventListener('click', event => {
        if(event.target){
            //Remove icons
            $('ion-icon').remove();

            if(['none', 'down'].includes(sortStatus[event.target.id])){
                //Sort in ascending order
                sort_header(items, 'up', event.target.id);
                sortStatus[event.target.id] = 'up';

                //Add icon (up arrow)
                event.target.innerHTML += ' <ion-icon name="caret-up"></ion-icon>';
            }
            else if(sortStatus[event.target.id] === 'up'){
                //Sort in descending order
                sort_header(items, 'down', event.target.id);
                sortStatus[event.target.id] = 'down';

                //Add icon (down arrow)
                event.target.innerHTML += ' <ion-icon name="caret-down"></ion-icon>';
            }
            
            fill_table_body(items);
        }
    });

});


