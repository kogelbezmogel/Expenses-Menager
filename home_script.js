var inputs_number = 0;

window.onload = async () => {
    document.getElementById("add_files_button").addEventListener("click", addFileForm);
    document.getElementById("add_manually_button").addEventListener("click", addPaymentForm);
    document.getElementById("logout_button").addEventListener("click", logOut);

    
    let options = {
        method : 'GET',
        headers : { 'Content-Type' : 'application/json' }
    };
    let user_handle = document.getElementById('label_logout_button');
    let user_name = (await fetch('/Get/UserName', options)).json();
    user_handle.innerHTML = await user_name;

}


function addFileForm() {
    let div = document.getElementById("div_form");
    inputs_number = 1;

    let html = "";
    html += "<form action='/AddFiles' method='POST'>";
    html += "   <div id='all_inputs'>";
    html += "        <label id='file_label_1' for='file_1'> Nowy plik </label>";
    html += "        <input name='file_1' id='file_1' type='file' /> <br/>";
    html += "   </div>";
    html += "   <div>";
    html += "       <button id='add_inputs' type='button' onclick='addFileInput()'>+</button>";
    html += "       <button id='rem_inputs' type='button' onclick='remFileInput()'>-</button>";
    html += "   </div>";
    html += "   <p> <input id='submit_button' type='submit' value='Wyslij'> </p>";
    html += "</form>";

    div.innerHTML = html;

    let file_input = document.getElementById('file_1');
    file_input.addEventListener('change', function(e) {
        let label = document.getElementById('file_label_1');
        let path_array = file_input.value.split('\\');
        let file_name = path_array[ path_array.length - 1 ];
        file_name = ( file_name.length > 30 ) ? ( file_name.slice(0, 27) + '...' ) : ( file_name );

        label.innerHTML = `${file_name}`;
    });
}


function addFileInput() {

    if (inputs_number < 3) {
        inputs = document.getElementById("all_inputs");
        inputs_number++;

        label = document.createElement("label");
        label.htmlFor = `file_${inputs_number}`;
        label.id = `file_label_${inputs_number}`;
        label_text = document.createTextNode(" Nowy plik ");
        label.appendChild(label_text);

        input = document.createElement("input");
        input.name = `file_${inputs_number}`;
        input.id = `file_${inputs_number}`;
        input.type = "file";

        br = document.createElement("br");
        br.id = `file_break_${inputs_number}`;

        inputs.appendChild(label);
        inputs.appendChild(input);
        inputs.appendChild(br);

        let file_input = document.getElementById(`file_${inputs_number}`);
        file_input.addEventListener('change', function(e) {
            let label = document.getElementById(`file_label_${inputs_number}`);
            let path_array = file_input.value.split('\\');
            let file_name = path_array[ path_array.length - 1 ];
            file_name = ( file_name.length > 30 ) ? ( file_name.slice(0, 27) + '...' ) : ( file_name );
    
            label.innerHTML = `${file_name}`;
        });
    }
    else
        window.location.href = 'https://www.youtube.com/watch?v=SW522CLn3Vk';
}


function addPaymentForm() {
    div = document.getElementById("div_form");
    inputs_number = 1;

    html = "";
    html += "<form action='/AddPayment' method='POST'>";
    html +=     "<div id='store_input_div' >";
    html +=         "<input name='store_input' id='store_input' type='text' placeholder='Sklep' />";
    html +=     "</div>";
    html += "   <div id='all_inputs'>";
    html +=         "<input name='payment_item_input_1' id='payment_item_input_1' type='text' placeholder='Produkt' />";
    html +=         "<input name='payment_price_input_1' id='payment_price_input_1' type='text' placeholder='Cena' /> <br/>";
    html += "   </div>";
    html += "   <div>";
    html += "       <button id='add_payment_input' type='button' onclick='addPaymentInput()'> + </button>";
    html += "       <button id='rem_payment_input' type='button' onclick='remPaymentInput()'> - </button>";
    html += "   </div>";
    html += "   <p> <input id='submit_button' type='submit' value='Wyslij'> </p>";
    html += "</form>";

    div.innerHTML = html;
}


function addPaymentInput() {

    inputs = document.getElementById("all_inputs");
    inputs_number++;

    input_item = document.createElement("input");
    input_item.name = `payment_item_input_${inputs_number}`;
    input_item.id = `payment_item_input_${inputs_number}`;
    input_item.type = "text";
    input_item.placeholder = "Produkt";

    input_price = document.createElement("input");
    input_price.name = `payment_price_input_${inputs_number}`;
    input_price.id = `payment_price_input_${inputs_number}`;
    input_price.type = "text";
    input_price.placeholder = "Cena";

    br = document.createElement("br");
    br.id = `payment_break_${inputs_number}`;

    inputs.appendChild(input_item);
    inputs.appendChild(input_price);
    inputs.appendChild(br);
}


function remPaymentInput() {
    if (inputs_number > 1) {
        document.getElementById(`payment_item_input_${inputs_number}`).remove();
        document.getElementById(`payment_price_input_${inputs_number}`).remove();
        document.getElementById(`payment_break_${inputs_number}`).remove();
        inputs_number--;
    }
}


function remFileInput() {
    if (inputs_number > 1) {
        document.getElementById(`file_${inputs_number}`).remove();
        document.getElementById(`file_label_${inputs_number}`).remove();
        document.getElementById(`file_break_${inputs_number}`).remove();
        inputs_number--;
    }
}

async function logOut() {

    options = {
        method: "GET",
        headers: { "Content-Type": "text/plain" }
    }

    await fetch('LogOut', options);
    //response = await fetch('/LogOut', options);
    //address = await response.text();
    //window.location.href = address
    window.location.reload();
}