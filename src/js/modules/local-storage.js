export function write( dbName, data ){
    const dataString = JSON.stringify(data);
    localStorage.setItem(dbName, dataString);
}

export function read(dbName){
    const dataObject = localStorage.getItem(dbName);
    if (dataObject === null) {
        return [];
    }
    const data = JSON.parse(dataObject);
    return Array.isArray(data) ? data : [data]; 
};

reader = new FileReader()
read.onload();

JSON.stringify(file)