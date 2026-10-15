import { Prisma } from "@/app/generated/prisma/client";


export default async function formValidation(model: keyof typeof Prisma["ModelName"], values: object) {

  const cols = Prisma[`${model}ScalarFieldEnum`]
  const modelKeys = Object.keys(cols)
  const valuesKeys = Object.keys(values)

  const missedKey = modelKeys.filter(o => !valuesKeys.includes(o))

  if (missedKey.length) return missedKey

  const emptyValues = Object.entries(values).filter(([key, value]) => {
    return !value
  }).map(d => d[0])

  return emptyValues
}