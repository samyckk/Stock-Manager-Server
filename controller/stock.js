import Stock from "../models/Stock.js";


export const addStock = async(req,res)=>{
    try{
        console.log(req.body);
        const newstocks = new Stock(req.body);
        const olditem = await Stock.findOne( {item: newstocks.item} );
        
        if(olditem){
            console.log("old");

            const totalweight = olditem.weight+newstocks.weight;
            console.log("total weight", totalweight);
            const temp = (olditem.weight*olditem.purchase) + (newstocks.weight*newstocks.purchase);
            const newPrice = temp/totalweight;

            const updatedItem = await Stock.findOneAndUpdate({item: olditem.item},
                { $set : {purchase: newPrice, weight : totalweight},  },
                { new: true }
            )
            console.log(updatedItem);

            return res.status(200).json(updatedItem);
        }
        else{
            console.log(newstocks);
            await newstocks.save();
            return res.status(200).json(newstocks);
        }
        
    }
    catch(err){
        return res.status(500).json({message: "error in adding Stock"});
    }
}

export const getStock = async (req,res)=>{
    try{
        const allStock = await Stock.find();
        console.log(allStock);
        return res.status(200).json(allStock);
    }
    catch(err){
        return res.status(500).json("error in getting Stocks");
    }
}