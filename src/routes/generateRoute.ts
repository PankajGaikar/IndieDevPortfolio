import { Router, Request, Response } from 'express';
import { buildDeveloperPortfolio } from '../core/portfolioService';
import { generatePortfolioImage, generateOutputFilename } from '../generator/imageGenerator';
import { GenerateRequest, GenerateResponse, CardStyle, CardSize, ScanMode, CARD_STYLES, CARD_DIMENSIONS } from '../lib/types';
import * as fs from 'fs';
import * as path from 'path';

const VALID_SIZES: CardSize[] = ['landscape', 'story', 'square'];
const VALID_SCAN_MODES: ScanMode[] = ['quick', 'major', 'global'];

const router = Router();

// Output directory for generated images
const OUTPUT_DIR = path.join(__dirname, '../../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * POST /api/generate
 * 
 * Generate a portfolio card image from an App Store URL or ID
 * 
 * Body: { "input": "<app-url-or-id>" }
 * Response: PNG image or JSON error
 */
router.post('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { input, style: requestedStyle, size: requestedSize, scanMode: requestedScanMode } = req.body as GenerateRequest;
  
  // Validate and default style
  const style: CardStyle = CARD_STYLES.includes(requestedStyle as CardStyle) 
    ? (requestedStyle as CardStyle) 
    : 'dark';
  
  // Validate and default size
  const size: CardSize = VALID_SIZES.includes(requestedSize as CardSize)
    ? (requestedSize as CardSize)
    : 'landscape';

  // Validate and default scan mode
  const scanMode: ScanMode = VALID_SCAN_MODES.includes(requestedScanMode as ScanMode)
    ? (requestedScanMode as ScanMode)
    : 'quick';

  console.log(`[API] Generate request: ${input} (style: ${style}, size: ${size}, scan: ${scanMode})`);

  // Validate input
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    const response: GenerateResponse = {
      success: false,
      error: 'Please provide an App Store URL or ID',
      code: 'INVALID_INPUT',
    };
    return res.status(400).json(response);
  }

  try {
    // Step 1: Build the portfolio data
    const portfolioResult = await buildDeveloperPortfolio(input.trim(), scanMode);

    if (!portfolioResult.success) {
      const response: GenerateResponse = {
        success: false,
        error: portfolioResult.error,
        code: portfolioResult.code,
      };
      return res.status(400).json(response);
    }

    // Step 2: Generate the image
    const imageBuffer = await generatePortfolioImage(portfolioResult.data, style, size);

    // Step 3: Save to output directory (optional, for debugging)
    const filename = generateOutputFilename(portfolioResult.data.developer.id);
    const outputPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outputPath, imageBuffer);

    const duration = Date.now() - startTime;
    console.log(`[API] Request completed in ${duration}ms`);

    // Return the image
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': imageBuffer.length,
      'Content-Disposition': `inline; filename="${filename}"`,
      'X-Developer-Name': encodeURIComponent(portfolioResult.data.developer.name),
      'X-Total-Apps': portfolioResult.data.stats.totalApps.toString(),
      'X-Total-Ratings': portfolioResult.data.stats.totalRatings.toString(),
      'X-Generation-Time': `${duration}ms`,
    });

    return res.send(imageBuffer);
  } catch (error) {
    console.error('[API] Generation error:', error);
    
    const response: GenerateResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate portfolio card',
      code: 'GENERATION_FAILED',
    };
    return res.status(500).json(response);
  }
});

/**
 * POST /api/generate/json
 * 
 * Get portfolio data as JSON (without generating image)
 * Useful for previewing data before image generation
 */
router.post('/json', async (req: Request, res: Response) => {
  const { input, scanMode: requestedScanMode } = req.body as GenerateRequest;

  // Validate and default scan mode
  const scanMode: ScanMode = VALID_SCAN_MODES.includes(requestedScanMode as ScanMode)
    ? (requestedScanMode as ScanMode)
    : 'quick';

  console.log(`[API] JSON request: ${input} (scan: ${scanMode})`);

  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide an App Store URL or ID',
      code: 'INVALID_INPUT',
    });
  }

  try {
    const portfolioResult = await buildDeveloperPortfolio(input.trim(), scanMode);

    if (!portfolioResult.success) {
      return res.status(400).json({
        success: false,
        error: portfolioResult.error,
        code: portfolioResult.code,
      });
    }

    return res.json({
      success: true,
      portfolio: portfolioResult.data,
    });
  } catch (error) {
    console.error('[API] JSON request error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch portfolio data',
      code: 'GENERATION_FAILED',
    });
  }
});

export default router;

