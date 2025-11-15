# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - heading "Sign in to your account" [level=2] [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]:
          - text: Email
          - textbox "Email" [active] [ref=e9]:
            - /placeholder: user@example.com
        - generic [ref=e10]:
          - text: Password
          - textbox "Password" [ref=e11]:
            - /placeholder: ••••••••
        - button "Sign In" [ref=e12]
      - generic [ref=e13]:
        - link "Forgot password?" [ref=e14] [cursor=pointer]:
          - /url: /auth/forgot-password
        - generic [ref=e15]:
          - text: Don't have an account?
          - link "Sign up" [ref=e16] [cursor=pointer]:
            - /url: /auth/register
      - generic [ref=e17]:
        - button "Sign in with Google" [ref=e18]
        - button "Sign in with Facebook" [ref=e19]
  - alert [ref=e20]
```