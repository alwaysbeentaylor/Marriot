require('dotenv').config();
const googleSearch = require('./src/services/googleSearch');

async function testGoogleSearch() {
    console.log('🔍 Testing Google Search Function...\n');
    console.log('='.repeat(60));
    
    // Test configuration
    console.log('\n📋 Configuration Check:');
    console.log(`   Proxy URL: ${process.env.PROXY_URL ? '✅ Set' : '❌ NOT SET'}`);
    console.log(`   2Captcha API Key: ${process.env.TWO_CAPTCHA_API_KEY ? '✅ Set (' + process.env.TWO_CAPTCHA_API_KEY.substring(0, 8) + '...)' : '❌ NOT SET'}`);
    console.log(`   Search Delay: ${process.env.GOOGLE_SEARCH_DELAY || '2500'}ms`);
    console.log(`   Render Environment: ${process.env.RENDER === 'true' ? '✅ Yes' : '❌ No (local)'}`);
    
    // Test query
    const testQuery = 'Defano Holwijn';
    console.log(`\n🔎 Test Query: "${testQuery}"`);
    console.log('='.repeat(60));
    console.log('\n⏳ Starting search (this may take 30-60 seconds)...\n');
    
    const startTime = Date.now();
    
    try {
        const results = await googleSearch.search(testQuery, 5);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log('\n' + '='.repeat(60));
        console.log(`\n✅ Search completed in ${duration}s`);
        console.log(`📊 Results found: ${results.length}\n`);
        
        if (results.length > 0) {
            console.log('📋 Search Results:');
            console.log('='.repeat(60));
            results.forEach((result, index) => {
                console.log(`\n${index + 1}. ${result.title || 'No title'}`);
                console.log(`   🔗 ${result.link || 'No link'}`);
                if (result.snippet) {
                    const snippet = result.snippet.length > 150 
                        ? result.snippet.substring(0, 150) + '...' 
                        : result.snippet;
                    console.log(`   📝 ${snippet}`);
                }
            });
            console.log('\n' + '='.repeat(60));
            console.log('\n✅ Google Search is WORKING!');
        } else {
            console.log('⚠️  No results found. This could mean:');
            console.log('   1. CAPTCHA was not solved');
            console.log('   2. Google blocked the request');
            console.log('   3. No results exist for this query');
            console.log('   4. Proxy issues');
            console.log('\n❌ Google Search may have issues');
        }
        
        // Clean up
        await googleSearch.closeBrowser();
        
        return results.length > 0;
        
    } catch (error) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log('\n' + '='.repeat(60));
        console.log(`\n❌ Search failed after ${duration}s`);
        console.log(`   Error: ${error.message}`);
        console.log(`   Stack: ${error.stack}`);
        console.log('\n' + '='.repeat(60));
        
        // Clean up
        try {
            await googleSearch.closeBrowser();
        } catch (e) {
            // Ignore cleanup errors
        }
        
        return false;
    }
}

// Run test
testGoogleSearch()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

