import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Sem globals, o auto-cleanup do RTL não engata sozinho — registramos aqui.
afterEach(() => cleanup())
