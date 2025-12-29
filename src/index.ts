import * as core from "@actions/core";
import * as http from "@actions/http-client";

interface Border0TokenRequest {
  organization_subdomain: string;
  service_account_name: string;
  web_identity_token: string;
  border0_token_duration_seconds?: number;
}

interface Border0TokenResponse {
  token: string;
}

async function run(): Promise<void> {
  try {
    // Get inputs
    const org = core.getInput("border0-org-subdomain", { required: true });
    const svcAccount = core.getInput("border0-svc-account-name", {
      required: true,
    });
    const durationSeconds = parseInt(
      core.getInput("border0-token-duration-seconds", { required: true }),
      10,
    );
    const apiBaseUrl = core.getInput("border0-api-url", {
      required: true,
    });

    core.info(`Exchanging GitHub OIDC token for Border0 credentials...`);
    core.info(`Organization: ${org}`);
    core.info(`Service Account: ${svcAccount}`);
    core.info(`Duration: ${durationSeconds} seconds`);

    // Get GitHub OIDC token
    const githubToken = await core.getIDToken("api.border0.com");

    if (!githubToken) {
      throw new Error(
        "Failed to get GitHub OIDC token. Ensure id-token: write permission is set in your workflow.",
      );
    }

    // Prepare request
    const client = new http.HttpClient("configure-border0-credentials");
    const endpoint = `${apiBaseUrl}/auth/web_identity/exchange`;

    const requestBody: Border0TokenRequest = {
      organization_subdomain: org,
      service_account_name: svcAccount,
      web_identity_token: githubToken,
      border0_token_duration_seconds: durationSeconds,
    };

    core.debug(`Calling Border0 API: ${endpoint}`);

    // Make API request
    const response = await client.postJson<Border0TokenResponse>(
      endpoint,
      requestBody,
      {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    );

    if (response.statusCode !== 200) {
      throw new Error(
        `Border0 API returned status ${response.statusCode}: ${JSON.stringify(response.result)}`,
      );
    }

    if (!response.result || !response.result.token) {
      throw new Error("Border0 API response did not contain a token");
    }

    // Set output
    core.setOutput("token", response.result.token);
    core.setSecret(response.result.token); // Mask token in logs
    core.info("Successfully obtained Border0 credentials");
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unknown error occurred");
    }
  }
}

run();
