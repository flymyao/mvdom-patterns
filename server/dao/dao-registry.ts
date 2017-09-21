'use strict';
import {BaseDao} from "./BaseDao";

export module daoRegistry{

    export function getDao(type:string){
        return new BaseDao(type);
    }
}