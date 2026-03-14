# Terraform conventions

This project follows the [Google Cloud Terraform best practices][gcp-bp],
which cover style, structure, and operational guidance for Terraform
configurations.

## Reference guides

- [General style and structure][style] — module layout, naming, variables,
  outputs, and formatting
- [Reusable modules][modules] — designing composable, shareable modules
- [Root modules][root] — organizing top-level configurations
- [Dependency management][deps] — managing provider and module versions
- [Cross-configuration communication][cross] — sharing state across
  configurations
- [Working with Google Cloud resources][resources] — GCP-specific patterns
- [Version control][vcs] — repository and branching strategies
- [Operations][ops] — plan/apply workflows and state management
- [Security][security] — secrets, IAM, and least-privilege practices
- [Testing][testing] — validation and testing strategies

[gcp-bp]: https://docs.cloud.google.com/docs/terraform/best-practices/general-style-structure
[style]: https://docs.cloud.google.com/docs/terraform/best-practices/general-style-structure
[modules]: https://docs.cloud.google.com/docs/terraform/best-practices/reusable-modules
[root]: https://docs.cloud.google.com/docs/terraform/best-practices/root-modules
[deps]: https://docs.cloud.google.com/docs/terraform/best-practices/dependency-management
[cross]: https://docs.cloud.google.com/docs/terraform/best-practices/cross-config-communication
[resources]: https://docs.cloud.google.com/docs/terraform/best-practices/working-with-resources
[vcs]: https://docs.cloud.google.com/docs/terraform/best-practices/version-control
[ops]: https://docs.cloud.google.com/docs/terraform/best-practices/operations
[security]: https://docs.cloud.google.com/docs/terraform/best-practices/security
[testing]: https://docs.cloud.google.com/docs/terraform/best-practices/testing
