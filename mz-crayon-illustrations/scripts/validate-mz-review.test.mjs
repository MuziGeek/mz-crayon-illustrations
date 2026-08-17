import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {validateMzReview} from "./validate-mz-review.mjs";
function png(width,height){const data=Buffer.alloc(24);data[1]=0x50;data[2]=0x4e;data[3]=0x47;data.writeUInt32BE(width,16);data.writeUInt32BE(height,20);return data;}
function review(){return {schema:"creator.mz-crayon-review/1",status:"READY_FOR_REVIEW",judgment:"one judgment",structure:"single-point",density:"minimal",metaphor:"a bridge",objects:[{name:"bridge",role:"action"}],storyFlow:"input -> bridge -> result",characterMode:"none",characterProfile:null,lockedLabels:["输入","连接","结果"],regenerationRounds:0,textRevisionRounds:0,outputPath:"output.png"};}
test("validates identity-neutral review",async()=>{const root=await fs.mkdtemp(path.join(os.tmpdir(),"mz-review-"));await fs.writeFile(path.join(root,"output.png"),png(1672,941));assert.equal((await validateMzReview(review(),path.join(root,"review.json"))).ok,true);});
test("requires explicit external profile provenance",async()=>{const root=await fs.mkdtemp(path.join(os.tmpdir(),"mz-review-"));await fs.writeFile(path.join(root,"output.png"),png(1672,941));const value=review();value.characterMode="external";await assert.rejects(()=>validateMzReview(value,path.join(root,"review.json")),/characterProfile/);});
