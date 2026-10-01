import React from 'react';
import {Button} from "@mantine/core";

import getUserPackages from "@/backend/actions/user/getPackage.action";
import {PackageDuration} from "@/app/generated/prisma";

const DURATION_PRICES: Record<PackageDuration, "price1m" | "price3m" | "price6m"> = {
    MONTH1: "price1m",
    MONTH3: "price3m",
    MONTH6: "price6m",
};

const DURATION_LABELS: Record<PackageDuration, string> = {
    MONTH1: "۱ ماهه",
    MONTH3: "۳ ماهه",
    MONTH6: "۶ ماهه",
};

const ActivePlanCard = async () => {

    const pkg = await getUserPackages()
    const plan = pkg?.package

    if (!plan) return (
        <div className="mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-6">
            پلن فعالی ندارید
        </div>
    )

    const duration = pkg?.duration ?? "MONTH1";
    const priceField = DURATION_PRICES[duration as PackageDuration];
    const price = plan[priceField];

    return (
        <div className="mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-6">
            {/* هدر پلن */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">پلن فعلی شما</h2>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">{plan.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>
                <div className={"flex gap-2 items-center"}>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                        فعال
                    </span>
                    <div>
                        <Button size={"xs"} color={"red"}>
                            غیرفعال سازی
                        </Button>
                    </div>
                </div>

            </div>

            {/* قیمت */}
            <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{price?.toLocaleString("fa")}</span>
                <span className="text-gray-500 ml-1">تومان</span>
                <span className="text-gray-400 text-sm mr-2">({DURATION_LABELS[duration as PackageDuration]})</span>
            </div>

            {/* لیست امکانات */}
            <div className="space-y-3 mb-8">
                {plan.options.map((option, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {option}
                    </div>
                ))}
            </div>


        </div>
    );
};

export default ActivePlanCard;
