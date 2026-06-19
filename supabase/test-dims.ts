const accessToken = Deno.env.get("SUPABASE_ACCESS_TOKEN");
const propertyId = "524798829";

async function runReport(dimName: string) {
  const resp = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metrics: [{ name: "activeUsers" }],
        dimensions: [{ name: dimName }],
      }),
    }
  );
  const data = await resp.json();
  console.log(`--- ${dimName} ---`);
  console.log(JSON.stringify(data.rows, null, 2));
}

async function main() {
  await runReport("unifiedScreenName");
  await runReport("unifiedPageScreen");
  await runReport("unifiedPagePathScreen");
  await runReport("pagePathPlusQueryString");
}

main();
