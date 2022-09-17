import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

type dataSet = {
    Province_State: string;
    Population: number;
    '4/27/21': number;
};

(() => {
  const csvFilePath = path.resolve(__dirname, './prueba.csv');

  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  parse(fileContent, {
    delimiter: ',', 
  }, 
  (error:any, result: Array<dataSet[]>) => {
    if (error) {
      console.error(error);
    }
    const states : Array<string>=[];
    result.forEach(data=>{
        if(!states.includes(data[6].toString())){
            states.push(data[6].toString())
        }
    })
    states.shift()
    let dataStates: Array<{
        ProvinceState: string,
        population: number,
        covidDeaths: number,
        PercentageDeaths: number
    }> =[]
    for(let i:number=0; i<states.length; i++){
        let populationSum: number = 0;
        let covidDeaths: number =0;        
        const resultStates:dataSet[][] = result.filter(data=>data[6].toString()==states[i])
        resultStates.forEach(data=> {
            populationSum = populationSum + parseInt(data[11].toString())
            covidDeaths = covidDeaths + parseInt(data[data.length-1].toString())
        })
        if(populationSum>0){
            dataStates.push({
                ProvinceState: states[i],
                population: populationSum,
                covidDeaths: covidDeaths,
                PercentageDeaths: parseFloat(((covidDeaths*100)/populationSum).toFixed(4))
            })
        }   
    }
    answer(dataStates)
  });
})();

function answer(dataStates: Array<{ProvinceState: string,population: number,covidDeaths: number,PercentageDeaths: number}>){
    //Punto 1
    const max : number = Math.max(...dataStates.map(data => data.covidDeaths));
    console.log("1) El estado con mayor acumulado a la fecha es: ",dataStates.find(value => value.covidDeaths === max)?.ProvinceState, "con", max)
    console.log("\n")
    
    //Punto 2
    const min : number = Math.min(...dataStates.map(data => data.covidDeaths));
    console.log("2) El estado con menor acumulado a la fecha es: ",dataStates.find(value => value.covidDeaths === min)?.ProvinceState, "con", min)
    console.log("\n")
    
    
    // Punto 3
    console.log("3)Porcentaje de muertes por estado")
    dataStates.forEach(data =>{
        console.log(data.ProvinceState,"tiene una poblacion de",data.population,"y un % de muertes de", data.PercentageDeaths+"%")
    })
    console.log("\n")
    //Punto 4
    const maxDeaths : number = Math.max(...dataStates.map(data => data.PercentageDeaths));
    console.log("4) El estado mas afectado es:",dataStates.find(value => value.PercentageDeaths === maxDeaths)?.ProvinceState, "Ya que es el que posee",
    "la relacion de porcentajes de muertes\n mas alta con restpecto a su poblacion total teniendo un porcentaje de relacion de",maxDeaths)


}