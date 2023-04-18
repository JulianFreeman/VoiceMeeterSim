function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
        function (c) {
            let r = Math.random() * 16 | 0;
            let v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
    );
}

function add2Endpoints(instance, elemId) {
    instance.addEndpoint(elemId, {
        endpoint: "Dot",
        anchor: ["RightMiddle"],
        isSource: true,
        connectionType: "red-conn",
        maxConnections: 5,
        type: "out",
    });
    instance.addEndpoint(elemId, {
        endpoint: "Rectangle",
        anchor: ["LeftMiddle"],
        isTarget: true,
        connectionType: "red-conn",
        maxConnections: 5,
        type: "in",
    });
}


let inpLs = document.querySelectorAll("#inf-in ul li");
let outpLs = document.querySelectorAll("#inf-out ul li");

const instance = jsPlumb.getInstance({});
instance.bind("ready", function () {
    instance.registerConnectionTypes({
        "red-conn": {
            // paintStyle: { stroke: "green", strokeWidth: 2 },
            paintStyle: {
                gradient: {
                    stops: [[0, "orange"], [1, "blue"]]
                },
                strokeWidth: 2,
            },
            hoverPaintStyle: { strokeWidth: 4 },
            connector: "Straight",
        }
    });
    instance.registerEndpointTypes({
        "out": {
            paintStyle: { fill: "orange", radius: 5 }
        },
        "in": {
            paintStyle: { fill: "blue", width: 10, height: 10 }
        }
    });
    for (let i of inpLs) {
        add2Endpoints(instance, i);
    }
    for (let o of outpLs) {
        add2Endpoints(instance, o);
    }

    $("#out-but").draggable({
        helper: "clone",
        containment: "#out",
        appendTo: "#out-int",
    });
    $("#in-but").draggable({
        helper: "clone",
        containment: "#in",
        appendTo: "#in-int",
    });

    const dropEvent = function (event, ui) {
        let id = uuidv4();
        let clone = $(ui.helper).clone(true);
        clone.attr("id", id);
        clone.appendTo(this);
        //it doesn't work well when the containment is true, don't know why
        instance.draggable(id, { containment: false });
        add2Endpoints(instance, id);
    }

    $("#out-int").droppable({
        drop: dropEvent
    });
    $("#in-int").droppable({
        drop: dropEvent
    });
});
