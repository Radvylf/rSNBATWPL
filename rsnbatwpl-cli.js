(async () => {
    var fs = require("fs").promises;
    var io_c = require("readline");
    
    var rsn = require("./rsnbatwpl");
    
    var script = process.argv[2];
    
    var input_hist = [];
    var rsn_hist = [];
        
    var io;
    
    var try_rsn = async () => {
        var scop = null;
        
        var don_t_stop = !0;
        
        var data;
        
        while (don_t_stop) {
            io = io_c.createInterface({
                input: process.stdin,
                output: process.stdout,
                history: rsn_hist
            });
        
            io.on("history", (history) => {
                rsn_hist = history;
            });
        
            io.on("SIGINT", () => {
                console.log("");

                don_t_stop = !1;

                io.close();
            });
        
            await new Promise((r) => io.question("(rSNBATWPL) ", async (script) => {
                io.close();
                
                data = await rsn(script, null, (data) => new Promise((r) => {
                    io = io_c.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                        history: input_hist
                    });
        
                    io.on("history", (history) => {
                        input_hist = history;
                    });

                    io.on("SIGINT", () => {
                        console.log("");

                        don_t_stop = !1;

                        io.close();
                    });

                    io.question(data.sprints, (inp) => {
                        io.close();

                        r(inp);
                    });
                }), scop);
                
                scop = data.scop;
                
                if (data.prints.length)
                    console.log(data.prints.join("\n"));
                
                scop.set("(prints)", {
                    type: "array",
                    data: []
                });
                
                console.log(data.out);
                
                r();
            }));
        }
    };
    
    if (!script) {
        try_rsn();
        
        return;
    }
    
    script = await fs.readFile(script, "utf-8");
    
    var inputs = process.argv.slice(3);
    
    var scop = null;
    var data;
    
    data = await rsn(script, inputs, (data) => new Promise((r) => {
        io = io_c.createInterface({
            input: process.stdin,
            output: process.stdout,
            history: input_hist
        });
        
        io.on("history", (history) => {
            input_hist = history;
        });

        io.on("SIGINT", () => {
            console.log("");

            don_t_stop = !1;

            io.close();
        });
        
        io.question(data.sprints, (inp) => {
            io.close();
            
            r(inp);
        });
    }), scop);
    
    if (data.sprints)
        console.log(data.sprints);
})();
