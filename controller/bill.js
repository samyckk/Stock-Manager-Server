//Write all the function used in bills route

import Recipt from '../models/Recipt.js'
import Stock from '../models/Stock.js';

export const storeBill = async (req, res) => {
    try {
        const newrecipt = new Recipt(req.body);
        const profits = [];

        const updatePromises = newrecipt.items.map(async (it, index) => {
            const stockItem = await Stock.findOne({ item: it });
            if (stockItem) {
                const newWeight = stockItem.weight - newrecipt.weights[index];
                const profit = newrecipt.weights[index] * (newrecipt.rates[index]-stockItem.purchase);
                console.log(profit);
                profits.push(profit);

                const updatedStock = await Stock.findOneAndUpdate(
                    { item: it },
                    { $set: { weight: newWeight } },
                    { new: true }
                );


            }
            else{
                return res.status(404).json("Out of Stock");
            }
        });

        await Promise.all(updatePromises);

        newrecipt.profits = profits;     
        await newrecipt.save();

        return res.status(200).json(newrecipt);

    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(500).json({ message: "error in storing bill" });
    }
};

export const getBill = async(req,res)=>{
    try{
        const records = await Recipt.find().sort({ createdAt: -1 }); 

        return res.status(200).json(records);
    }
    catch(err){
        return res.status(500).json({message: "error in getting bill"});
    }
}

export const billAtName = async(req,res)=>{
    try{

        console.log(".");
        

        return res.status(200).json(records);
    }
    catch(err){
        return res.status(500).json({message: "error in getting bill"});
    }
}

export const getMonthly = async (req, res) => {
    try {
        let monthlyBils;

        if (req.query.month !== "All") {
            const month = Number(req.query.month);
            const startDate = new Date(2024, month - 1, 1);
            const endDate = new Date(2024, month, 1);

            if (req.query.name !== "All") {
                monthlyBils = await Recipt.find({
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate
                    },
                    name: req.query.name
                });
            } else {
                monthlyBils = await Recipt.find({
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate
                    }
                });
            }

            console.log(monthlyBils);
            return res.status(200).json(monthlyBils);
        } else {
            let records;
            if(req.query.name !== "All"){
                const name = req.query.name;
                
                records = await Recipt.find({ name: name }).sort({ createdAt: -1 });
            }
            else{
                records = await Recipt.find().sort({ createdAt: -1 });
            }

            return res.status(201).json(records);
        }

    } catch (err) {
        return res.status(500).json("error in getting Monthly");
    }
}

export const details = async (req, res) => {
    try {
        
        const resu = {
            name: req.query.name,
            month: req.query.month,
            monthlyProfit: 0,
            monthlySales: 0
        }

        let monthlyBils;

        if (req.query.month !== "All") {
            
            const month = Number(req.query.month);
            const startDate = new Date(2024, month - 1, 1);
            const endDate = new Date(2024, month, 1);

            if (req.query.name !== "All") {
                monthlyBils = await Recipt.find({
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate
                    },
                    name: req.query.name
                });
            } else {
                monthlyBils = await Recipt.find({
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate
                    }
                });
            }
            
            //Find monthly Profit
            let monthlyProfit = 0;
            for(let i=0; i<monthlyBils.length; i++) {
                for( let j=0; j<monthlyBils[i].profits.length; j++){
                    if(monthlyBils[i].profits[j] !== 0){
                        monthlyProfit += Number(monthlyBils[i].profits[j]);
                    }  
                }           
            }
            console.log("monhtly Profit", monthlyProfit);

            //Monthly Sales
            let monthlySales = 0;
            for(let i=0; i<monthlyBils.length; i++) {
                for( let j=0; j<monthlyBils[i].items.length; j++){
                    monthlySales += Number(monthlyBils[i].weights[j] * monthlyBils[i].rates[j]);
                }           
            }
            console.log("monthlySales: " + monthlySales);

            resu.monthlyProfit = monthlyProfit;
            resu.monthlySales = monthlySales;

            return res.status(200).json(resu);
        } 
            //Month == "All"
        else {

            if (req.query.name !== "All") {
                monthlyBils = await Recipt.find({
                    name: req.query.name
                });
            } else {
                monthlyBils = await Recipt.find({
                });
            }

            let monthlyProfit = 0;
            for(let i=0; i<monthlyBils.length; i++) {
                for( let j=0; j<monthlyBils[i].profits.length; j++){
                    if(monthlyBils[i].profits[j] !== 0){
                        monthlyProfit += Number(monthlyBils[i].profits[j]);
                    }  
                }           
            }
            console.log("monhtly Profit", monthlyProfit);

            //Monthly Sales
            let monthlySales = 0;
            for(let i=0; i<monthlyBils.length; i++) {
                for( let j=0; j<monthlyBils[i].items.length; j++){
                    monthlySales += Number(monthlyBils[i].weights[j] * monthlyBils[i].rates[j]);
                }           
            }
            console.log("monthlySales: " + monthlySales);

            resu.monthlyProfit = monthlyProfit;
            resu.monthlySales = monthlySales;
            
            
            return res.status(201).json(resu);
        }

    } catch (err) {
        return res.status(500).json("error in getting details");
    }
}

