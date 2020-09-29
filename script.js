
function setDiv(value) {
    let divElement = document.getElementById('data');
    divElement.innerHTML = value;
}

function createColumn(obj) {
    return `
    <div class="card shadow-lg">
        <div class="card-body">
            <div><img class="avatar my-1 mr-2" src="${obj.avatar}" alt=""${obj.name}", width="100px"></div>
            <div class="card-text my-2">
                <div><strong>Name:</strong> <br>${obj.name}</div>
                <div><strong>Created:</strong> <br> ${new Date(obj.createdAt).toDateString()}</div>
            </div>
        </div>
    </div>
    <br>
    `;
}

function loader(){
    return `
    <div class="container">
    <div class="row">
        <div class="col-md-3 col-sm-6">
            <div class="progress blue">
                <span class="progress-left">
                    <span class="progress-bar"></span>
                </span>
                <span class="progress-right">
                    <span class="progress-bar"></span>
                </span>
                <div class="progress-value">Loading</div>
            </div>
        </div>
    </div>
    </div>
    `;
}

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    if (out.endsWith(',')) {
        let strLength = out.length;
        let strSplit = out.substring(0, strLength - 1);
        out = strSplit + ']';
    }

    return out;
}

function getDataArray() {
    let mockData;
    let promise = fetch('https://5f72e49e6833480016a9c1c9.mockapi.io/mypromise/api');
    
    return promise.then((response) => {
        let reader = response.body.getReader();
        console.log('hello');
        return reader.read();
    }).then((value) => {
        let data = Utf8ArrayToStr(value.value);
        mockData = JSON.parse(data);
        return mockData;
    });
}

function start(){
    setDiv(loader());
    getDataArray().then((arrayData) => {
        let finaldata = "";
        arrayData.forEach(value => {
            finaldata += createColumn(value);
        });
        setDiv(finaldata);
    });
}

start();