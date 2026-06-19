const accessToken = Deno.env.get("SUPABASE_ACCESS_TOKEN");
const propertyId = "524798829";

async function run(dimName: string) {
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
        dimensions: dimName ? [{ name: dimName }] : [],
      }),
    }
  );
  const data = await resp.json();
  console.log(`Dim: ${dimName || "NONE"}`);
  console.log(JSON.stringify(data.rows, null, 2));
}

async function main() {
  await run("");
  await run("unifiedScreenName");
  await run("unifiedScreenClass");
  // try others if needed
}

main();
