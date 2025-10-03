"use client";

import { ChangeEvent, useRef, useState } from "react";
import { LoaderCircle } from 'lucide-react';

export default function Tool() {
  const [n, setN] = useState<bigint | null>(null);
  const [result, setResult] = useState<[bigint, number][]>([]);
  const [factorizationComplete, setFactorizationComplete] = useState<boolean>(true);
  const [dividerProgress, setDividerProgress] = useState<bigint | null>(null);
  const [biggerNumber, setBiggerNumber] = useState<boolean>(false);
  const cancelToken = useRef(0); // Add this line

  function factorization(target: bigint) {
    setResult([]);
    setFactorizationComplete(false);

    const nums: [bigint, number][] = [];
    let k = target;
    const myToken = ++cancelToken.current; // Increment token for this run

    let i: bigint = 2n;
    function step() {
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

        if (c > 0) nums.push([i, c]);

        i++;

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
    <div className="text-black bg-conic-315 from-indigo-100 via-fuchsia-100 to-indigo-100 px-6 py-4 rounded-xl border border-slate-500/72 ring ring-gray-400/64">
      <h1 className="font-bold text-2xl mb-1 pb-1 text-center">Prime Factorization Tool</h1>

      <div>
        <label>
          Enable bigger number: <input type="checkbox" checked={biggerNumber} onChange={(e) => setBiggerNumber(e.target.checked)} />
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
        Result: <span className="text-gray-300 text-sm">({ dividerProgress })</span>
      </p>
      <div>
        { result.map((item, idx) =>
          <div className="bg-blue-500 shadow-md shadow-blue-500/50 rounded-sm animate-appear p-0.5 inline-block">
            `${item[0].toString()}${item[1] > 1 ? ` ^ ${item[1]}` : ""}`
          </div>
          ).join(' * ') }
        {!factorizationComplete && <LoaderCircle className="animate-spin inline-block ml-1" size={20} />}
      </div>
    </div>
  );
}