"use client";

import { ChangeEvent, Fragment, useRef, useState } from "react";
import { LoaderCircle } from 'lucide-react';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function formatExponent(exponent: number, type: boolean) {
  if (!type) return ` ^ ${exponent}`;

  /* completely forgot about <sup>
  const convertTo = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  return exponent.toString().split('').map(i => convertTo[parseInt(i)]).join('');
  */

  return (
    <sup>{exponent}</sup>
  )
}

export default function Tool() {
  const [n, setN] = useState<bigint | null>(null);
  const [result, setResult] = useState<[bigint, number][]>([]);
  const [factorizationComplete, setFactorizationComplete] = useState<boolean>(true);
  const [dividerProgress, setDividerProgress] = useState<bigint | null>(null);
  const [biggerNumber, setBiggerNumber] = useState<boolean>(false);
  const [exponentType, setExponentType] = useState<boolean>(true)
  const cancelToken = useRef(0); // Add this line
  const fasterCalculation = useRef(false);

  async function factorization(target: bigint) {
    setResult([]);
    setFactorizationComplete(false);

    const nums: [bigint, number][] = [];
    let k = target;
    const myToken = ++cancelToken.current; // Increment token for this run

    let i: bigint = 2n;
    async function step() {
      // Cancel if token changed
      if (cancelToken.current !== myToken) return;

      const start = performance.now();
      while (i * i <= k) {
        setDividerProgress(i);
        let c = 0;

        while (k % i === 0n) {
          c++;
          k /= i;

          setResult([...nums, [i, c]]);
        }
        
        if (!fasterCalculation.current) await delay(0);

        if (c > 0) nums.push([i, c]);

        // skip evens after 2, since 2 is the only even prime
        i += i !== 2n ? 2n : 1n;

        if (performance.now() - start > 16) {
          setTimeout(step, 0);
          return;
        }
      }

      if (k > 1n) nums.push([k, 1]);

      // Cancel if token changed before setting result
      if (cancelToken.current !== myToken) return;
      setResult(nums);
      setFactorizationComplete(true)
    }

    step();
  }

  async function onTargetChange(e: ChangeEvent<HTMLInputElement>) {
    setN(BigInt(e.target.value));
    factorization(BigInt(e.target.value));
  }

  return (
    <div className="text-black bg-conic-315 from-indigo-100 via-fuchsia-100 to-indigo-100 px-6 py-4 rounded-xl border border-slate-500/72 ring ring-gray-400/64 w-full min-h-full">
      <h1 className="font-bold text-2xl mb-1 pb-1 text-center">Prime Factorization Tool</h1>

      <div>
        <label>
          Enable bigger number: <input type="checkbox" checked={biggerNumber} onChange={(e) => setBiggerNumber(e.target.checked)} />
        </label>
      </div>
      <div>
        <label>   
          Use 2<sup>n</sup> format: <input type="checkbox" checked={exponentType} onChange={(e) => setExponentType(e.target.checked)} />
        </label>
      </div>   
      <div>
        <label>   
          Faster Calculation <small className="text-sm">(laggier)</small>: <input type="checkbox" defaultChecked={false} onChange={(e) => fasterCalculation.current = e.target.checked} />
        </label>
      </div>   

      <label>
        Target integer:
        <input
          className="ml-2 bg-white px-2 py-1 rounded-lg border border-slate-500 ring ring-slate-400/50"
          type={biggerNumber ? "text" : "number"} inputMode="numeric" pattern="\d*" 
          min={2} step={1}
          defaultValue={n?.toString()}
          onChange={onTargetChange}
          placeholder="n ≧ 2"
        />
      </label>

      <p className="mt-3">
        Result: { <span className="text-sm">
          ({result.length} unique primes)
        </span> }
        {!factorizationComplete && <>
          <LoaderCircle className="animate-spin inline-block mx-1" size={20} />
          <span
          className="text-gray-400 text-xs">
            ({ dividerProgress })
          </span>
        </>
        }
      </p>
      <div>
        { result.map((item, idx) =>
          <Fragment key={item[0]}>
            <div
              className="bg-blue-500 shadow-md shadow-blue-500/50 text-white rounded-sm animate-appear px-1 py-0.5 my-0.5 inline-block blur-none"
              style={{
                "--tw-hue-rotate": `hue-rotate(${idx / 7.2}deg)`
              } as React.CSSProperties & Record<string, any>}
            >
              {item[0].toString()}{item[1] > 1 && formatExponent(item[1], exponentType)}
            </div>
            {idx !== result.length - 1 && " * "}
          </Fragment>
        ) }
        {!factorizationComplete && <LoaderCircle className="animate-spin inline-block ml-1" size={20} />}
      </div>
    </div>
  );
}